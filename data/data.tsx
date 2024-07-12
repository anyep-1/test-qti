import axios from "axios";
import Cookies from "js-cookie";

export interface Asset {
  location_id: string;
  status_id: string;
  id: string;
  name: string;
}

export interface AssetResponse {
  count: number;
  page_count: number;
  page_size: number;
  page: number;
  results: Asset[];
}

export interface Status {
  id: string;
  name: string;
}

export interface CustomLocation {
  id: string;
  name: string;
}

export interface DetailData {
  id: string;
  name: string;
  status: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
}

export interface AggStatus {
  status: {
    id: string;
    name: string;
  };
  count: number;
}

export interface AggLocation {
  location: {
    id: string;
    name: string;
  };
  count: number;
}

const api = axios.create({
  baseURL: "https://be-ksp.analitiq.id",
});

export const fetchData = async (): Promise<Asset[]> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get<AssetResponse>("/asset/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1,
        page_size: 10,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchDataStatus = async (): Promise<Status[]> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/status/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchDataLocation = async (): Promise<CustomLocation[]> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/location/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchDetail = async (id: string): Promise<DetailData | null> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get(`/asset/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.id) {
      return response.data;
    } else {
      console.error("Unexpected data format:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching asset detail:", error);
    return null;
  }
};

export const fetchAggStatus = async (): Promise<AggStatus[]> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/home/agg-asset-by-status/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchAggLocation = async (): Promise<AggLocation[]> => {
  try {
    const token = Cookies.get("token");
    const response = await api.get("/home/agg-asset-by-location/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Unexpected data format:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
