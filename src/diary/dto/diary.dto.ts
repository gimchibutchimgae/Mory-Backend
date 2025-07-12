export interface CreateDiaryDTO {
  title: string;
  content: string;
}

export interface UpdateDiaryDTO {
  title?: string;
  content?: string;
}
