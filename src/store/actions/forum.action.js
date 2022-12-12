import { forumService } from "../../services/forum.service"



export const loadSubjects = async () => {
    // const mellofyUser = await userService.getById('6383387d22d1c6761ceb374a')
    const subjectsFromDb = await forumService.query()
    return subjectsFromDb
}