export interface VoltpressConfig {
  apiUrl: string
  clientId: string
  clientSecret: string
}

let _config: VoltpressConfig | null = null

export function configureVoltpress(config: VoltpressConfig): void {
  _config = config
}

export function getVoltpressConfig(): VoltpressConfig {
  if (!_config) {
    throw new Error(
      '[voltpress/js] Not configured. Call configureVoltpress({ apiUrl, clientId, clientSecret }) before using services.'
    )
  }
  return _config
}

export function isVoltpressConfigured(): boolean {
  return _config !== null
}
