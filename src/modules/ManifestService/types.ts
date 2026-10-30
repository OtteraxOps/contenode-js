export interface IContenodeLocale {
  locale: string
  is_default: boolean
}

export interface IContenodeFieldDefinition {
  [key: string]: unknown
}

export interface IContenodeSchemaEntry {
  slug: string
  name: string
  fields: IContenodeFieldDefinition[]
}

export interface IContenodeFormManifest {
  captcha_provider: string
  turnstile_site_key: string
  contact_form_schema: IContenodeFieldDefinition[]
  contact_form_message: string
  contact_form_success_message: string
}

export interface IContenodeManifest {
  locales: IContenodeLocale[]
  collections: IContenodeSchemaEntry[]
  globals: IContenodeSchemaEntry[]
  form: IContenodeFormManifest
}
