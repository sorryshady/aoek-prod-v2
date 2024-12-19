type Headers = { [name: string]: string };

type FormDataPart =
  | {
      string: string;
      headers: Headers;
      fieldName: string;
    }
  | {
      uri: string;
      headers: Headers;
      name?: string;
      type?: string;
      fieldName: string;
    };

export class CustomFormData extends FormData {
  constructor() {
    super();
  }

  getParts(): Array<FormDataPart> {
    // @ts-expect-error
    return this._parts.map(([name, value]) => {
      const contentDisposition = 'form-data; name="' + name + '"';

      const headers: Headers = { 'content-disposition': contentDisposition };

      // The body part is a "blob", which in React Native just means
      // an object with a `uri` attribute. Optionally, it can also
      // have a `name` and `type` attribute to specify filename and
      // content type (cf. web Blob interface.)
      if (typeof value === 'object' && !Array.isArray(value) && value) {
        if (typeof value.name === 'string') {
          headers['content-disposition'] += `; filename="${value.name}"`;
        }
        if (typeof value.type === 'string') {
          headers['content-type'] = value.type;
        }
        return { ...value, headers, fieldName: name };
      }
      // Convert non-object values to strings as per FormData.append() spec
      return { string: String(value), headers, fieldName: name };
    });
  }
}
