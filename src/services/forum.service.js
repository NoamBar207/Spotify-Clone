import { httpService } from "./http.service";
import { userService } from "./user.service";
import { utilService } from "./util.service";

const STORAGE_KEY = "forum";

export const forumService = {
  query,
  sendMsg,
  addQuestion,
  addLikeToAnswer,
};

async function query() {
  const forum = await httpService.get(STORAGE_KEY);
  return forum;
}

async function sendMsg(ans, msg, cluster, subject) {
  if (ans.txt.length > 1)
    return await httpService.put("forum/answer", {
      ans,
      msg,
      cluster,
      subject,
    });
}

async function addQuestion(question, cluster, subject) {
  return await httpService.put("forum/question", {
    question,
    cluster,
    subject,
  });
}

async function addLikeToAnswer(ans, userId, question, cluster, subject) {
  if (userId !== "Guest") {
    const isInclude = ans.likes.includes(userId);
    utilService.removeOrAdd(ans.likes, userId, isInclude);
    httpService.put("forum/like", { ans, question, cluster, subject });
    return ans;
  }
}
