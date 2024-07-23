export class FetchHelper {

  async post(url: string, payload: any, token?: string) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: this.headersBuilder(token),
      });

      const res = await response.json()

      if (!response.ok) {
        throw res.message || res || 'Request failed'
      }

      return { data: res };
    } catch (error: any) {
      return { error: error || 'Unknown error' };
    }
  }

  async get(url: string, token?: string) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headersBuilder(token),
      });

      const res = await response.json();

      if (!response.ok) {
        throw res.message || res || 'Request failed';
      }

      return { data: res };
    } catch (error: any) {
      return { error: error || 'Unknown error' };
    }
  }

  async patch(url: string, payload: any, token?: string) {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: this.headersBuilder(token),
      });

      const res = await response.json();

      if (!response.ok) {
        throw res.message || res || 'Request failed';
      }

      return { data: res };
    } catch (error: any) {
      return { error: error || 'Unknown error' };
    }
  }

  async delete(url: string, token?: string) {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headersBuilder(token),
      });

      const res = await response.json();

      if (!response.ok) {
        throw res.message || res || 'Request failed';
      }

      return { data: res };
    } catch (error: any) {
      return { error: error || 'Unknown error' };
    }
  }

  private headersBuilder(token?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json" }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    return headers;
  }
}