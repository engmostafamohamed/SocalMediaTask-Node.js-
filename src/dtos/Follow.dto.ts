export class FollowDto {
  followHandle: string;

  constructor(followHandle: string) {
    this.followHandle = followHandle;
  }

  validate(): string | null {
    if (!this.followHandle?.trim()) return 'Follow handle is required';
    return null;
  }
}