import PermissionChecker from '../../services/user/permissionChecker'
import ApiResponseHandler from '../apiResponseHandler'
import Permissions from '../../security/permissions'
import TagService from '../../services/tagService'

/**
 * GET /tenant/{tenantId}/tag/{id}
 * @summary Find a tag
 * @tag Tags
 * @security Bearer
 * @description Find a tag by ID.
 * @pathParam {string} tenantId - Your workspace/tenant ID.
 * @pathParam {string} id - The ID of the tag.
 * @response 200 - Ok
 * @responseContent {Tag} 200.application/json
 * @responseExample {Tag} 200.application/json.Tag
 * @response 401 - Unauthorized
 * @response 404 - Not found
 * @response 429 - Too many requests
 */
export default async (req, res) => {
  try {
    new PermissionChecker(req).validateHas(Permissions.values.tagRead)

    const payload = await new TagService(req).findById(req.params.id)

    await ApiResponseHandler.success(req, res, payload)
  } catch (error) {
    await ApiResponseHandler.error(req, res, error)
  }
}
