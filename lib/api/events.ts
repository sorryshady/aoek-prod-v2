import { sanityClient } from "@/sanity";

export type EventItem = {
  _id: string;
  title: string;
  image: any;
  description: string;
  dateRange: {
    startDate: string;
    endDate?: string;
  };
  location: string;
  fileUrl?: string;
  link?: string;
};

export async function getEvents() {
  const currentDate = new Date();
  const pastMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );

  try {
    const events = await sanityClient.fetch(
      `*[_type == "upcomingEvent" && dateRange.startDate >= $pastMonthDate] | order(dateRange.startDate asc) {
        _id,
        title,
        dateRange,
        location,
        link,
        "fileUrl": file.asset->url,
        description,
        image,
      }`,
      { pastMonthDate: pastMonthDate.toISOString() }
    );
    return separateEvents(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      ongoingEvents: [],
      upcomingEvents: [],
      pastEvents: []
    };
  }
}

export function separateEvents(events: EventItem[]) {
  const currentDate = new Date();

  return {
    ongoingEvents: events.filter((event) => {
      const startDate = new Date(event.dateRange.startDate);
      const endDate = new Date(event.dateRange.endDate || event.dateRange.startDate);
      return startDate <= currentDate && endDate >= currentDate;
    }),
    upcomingEvents: events.filter((event) => {
      return new Date(event.dateRange.startDate) > currentDate;
    }),
    pastEvents: events.filter((event) => {
      const endDate = event.dateRange.endDate || event.dateRange.startDate;
      return new Date(endDate) < currentDate;
    }).reverse()
  };
}
