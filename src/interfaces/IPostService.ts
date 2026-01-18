import { IUser } from "./IUser";
import { IPost } from "./IPost";

export interface IPostService {
  createPost(authorHandle: string, content: string): Promise<IPost>;
  getTimeline(userHandle: string, user: IUser): Promise<IPost[]>;
}
