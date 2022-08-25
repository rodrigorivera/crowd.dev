import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import cubejs from '@cubejs-client/core'
import { getConfig } from '../../config'
import Error400 from '../../errors/Error400'

export default class CubeJsService {
  private tenantId: string

  token: string

  api: any

  meta: any

  constructor(tenantId?: string) {
    this.tenantId = tenantId
  }

  /**
   * Sets tenant security context for cubejs api.
   * Also initializes cubejs api object from security context.
   * @param tenantId
   */
  async setTenant(tenantId: string): Promise<void> {
    this.tenantId = tenantId
    this.token = await CubeJsService.generateJwtToken(this.tenantId)
    this.api = cubejs(this.token, { apiUrl: getConfig().CUBE_JS_URL })
  }

  /**
   * Loads the result data for a given cubejs query
   * @param query
   * @returns
   */
  async load(query: any): Promise<any> {
    const result = await this.api.load(query)
    return result.loadResponses[0].data
  }

  static async generateJwtToken(tenantId: string | null) {
    const context = tenantId ? { tenantId } : {}
    const token = jwt.sign(context, getConfig().CUBE_JS_JWT_SECRET, {
      expiresIn: getConfig().CUBE_JS_JWT_EXPIRY,
    })

    return token
  }

  static async verifyToken(language, token, tenantId) {
    try {
      const decodedToken: any = jwt.verify(token, getConfig().CUBE_JS_JWT_SECRET)

      if (decodedToken.tenantId !== tenantId) {
        throw new Error400(language, 'cubejs.tenantIdNotMatching')
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new Error400(language, 'cubejs.invalidToken')
      }

      throw error
    }
  }
}