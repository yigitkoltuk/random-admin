import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "./authProvider";

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters }) => {
    // Pagination parametrelerini al
    // Refine bazen current yerine pagination objesi içinde currentPage kullanabilir
    let current = (pagination as any)?.current ?? 1;
    const pageSize = (pagination as any)?.pageSize ?? 10;

    // Eğer current hala 1 ise ve URL'de currentPage varsa, onu kullan
    if (current === 1 && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCurrentPage =
        urlParams.get("currentPage") || urlParams.get("current");
      if (urlCurrentPage) {
        current = parseInt(urlCurrentPage);
      }
    }

    const query: any = {
      page: current,
      limit: pageSize,
    };

    // Handle filters
    if (filters) {
      filters.forEach((filter: any) => {
        if (filter.operator === "eq") {
          query[filter.field] = filter.value;
        }
      });
    }

    // Handle sorters
    if (sorters && sorters.length > 0) {
      const sortField = sorters[0].field;
      const sortOrder = sorters[0].order === "asc" ? 1 : -1;
      query.sort = `${sortOrder === -1 ? "-" : ""}${sortField}`;
    }

    const url = `/${resource}`;

    try {
      const { data } = await axiosInstance.get(url, { params: query });

      // Handle different response formats
      let responseData;
      let total;

      if (Array.isArray(data)) {
        // Direct array response
        responseData = data;
        total = data.length;
      } else {
        // Standard format with data and total
        responseData = data.data || data;
        total =
          data.total || (Array.isArray(responseData) ? responseData.length : 0);
      }

      return {
        data: Array.isArray(responseData) ? responseData : [],
        total,
      };
    } catch (error) {
      throw error;
    }
  },

  getOne: async ({ resource, id }) => {
    const url = `/${resource}/${id}`;

    try {
      const { data } = await axiosInstance.get(url);
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  create: async ({ resource, variables }) => {
    const url = `/${resource}`;

    try {
      const { data } = await axiosInstance.post(url, variables);
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  update: async ({ resource, id, variables }) => {
    const url = `/${resource}/${id}`;

    try {
      const { data } = await axiosInstance.put(url, variables);
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  deleteOne: async ({ resource, id }) => {
    const url = `/${resource}/${id}`;

    try {
      const { data } = await axiosInstance.delete(url);
      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  },

  getApiUrl: () => {
    return "http://localhost:3000";
  },

  custom: async ({ url, method, filters, sorters, payload, headers }) => {
    let requestUrl = url;

    if (filters || sorters) {
      const queryParams: any = {};

      if (filters) {
        filters.forEach((filter: any) => {
          queryParams[filter.field] = filter.value;
        });
      }

      if (sorters && sorters.length > 0) {
        const sortField = sorters[0].field;
        const sortOrder = sorters[0].order === "asc" ? 1 : -1;
        queryParams.sort = `${sortOrder === -1 ? "-" : ""}${sortField}`;
      }

      const queryString = new URLSearchParams(queryParams).toString();
      requestUrl = `${url}?${queryString}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await axiosInstance[method](url, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await axiosInstance.delete(url, {
          data: payload,
          headers,
        });
        break;
      default:
        axiosResponse = await axiosInstance.get(requestUrl, {
          headers,
        });
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
};
