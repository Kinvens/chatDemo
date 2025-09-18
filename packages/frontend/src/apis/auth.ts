import request from "@/apis/request.ts";

/**
 * 登陆
 */
export async function login(payload: {
  account: string;
  password: string;
}): Promise<{
  code: number, data: {
    userId: string,
    account: string,
    accessToken: string
  }
}> {
  return await request.post("/auth/login", {
    account: payload.account,
    password: payload.password,
  })
}

async function logout() {

}

