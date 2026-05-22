import type { IVoltpressTeamMember } from '../../types/model.js'

export interface IGetTeamMemberListInput {
  page?: number
  items_per_page?: number
}

export type IGetTeamMemberListOutput = IVoltpressTeamMember[]
