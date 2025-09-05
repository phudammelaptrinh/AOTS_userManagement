import axios from "axios";

export interface UserDTO {
  id?: number | null;
  name: string;
  email: string;
  active: boolean;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  size: number;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api/users",
});

export const userApi = {

  async getAll() {
    const res = await api.get<UserDTO[]>("/get-all");
    return res.data;
  },

 
  async getPage(page: number, size: number): Promise<PageResult<UserDTO>> {
    const res = await api.get<UserDTO[]>("/get-page", { params: { page, size } });
    return {
      items: res.data,
      total: Number(res.headers["x-total-count"] ?? 0),
      totalPages: Number(res.headers["x-total-pages"] ?? 1),
      page: Number(res.headers["x-page"] ?? page),
      size: Number(res.headers["x-size"] ?? size),
    };
  },

  
  async createMany(users: UserDTO[]) {
    const res = await api.post("/create", users);
    return res.data;
  },

  
  async create(user: UserDTO) {
    const res = await api.post("/create", [user]);
    return res.data;
  },

  
  async update(id: number, user: UserDTO) {
    const res = await api.put(`/` + id, user);
    return res.data;
  },


  async delete(id: number) {
    const res = await api.delete("/" + id);
    return res.data;
  },
};
