import { voltpressFetch } from '../../client.js'
import type { IVoltpressApiResponse } from '../../types/index.js'
import type { IVoltpressTeamMember } from '../../types/model.js'
import type { IGetTeamMemberListInput, IGetTeamMemberListOutput } from './types.js'

export const teamMemberService = {
  async getTeamMemberList(input: IGetTeamMemberListInput = {}): Promise<IGetTeamMemberListOutput> {
    const response = await voltpressFetch<IVoltpressApiResponse<{ team_members: IVoltpressTeamMember[] }>>(
      '/api/team-member/list',
      {
        page: input.page,
        items_per_page: input.items_per_page,
      },
    )

    return response.data.team_members
  },
}
