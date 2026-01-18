export class CreatePostDto {
  content: string;

  constructor(content: string) {
    this.content = content;
  }

  validate(): string | null {
    if (!this.content?.trim()) return 'Content is required';
    if (this.content.length > 280) return 'Content must be 280 characters or less';
    return null;
  }
}