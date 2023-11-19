
export  interface AuthorIdType {
    _id: string;
    name: string;
    bio?: string
    books?: string[]; // Kiểu dữ liệu của books có thể là một mảng các chuỗi
  }