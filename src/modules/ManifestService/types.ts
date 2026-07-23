export interface IVoltpressLocale {
  locale: string
  is_default: boolean
}

export interface IVoltpressFieldDefinition {
  [key: string]: unknown
}

export interface IVoltpressSchemaEntry {
  slug: string
  name: string
  fields: IVoltpressFieldDefinition[]
}

export interface IVoltpressFormManifest {
  captcha_provider: string
  turnstile_site_key: string
  contact_form_schema: IVoltpressFieldDefinition[]
  contact_form_message: string
  contact_form_success_message: string
}

export interface IVoltpressManifest {
  locales: IVoltpressLocale[]
  collections: IVoltpressSchemaEntry[]
  globals: IVoltpressSchemaEntry[]
  form: IVoltpressFormManifest
}
