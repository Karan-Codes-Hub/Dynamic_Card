import { Input } from "antd";
import {
  DownloadOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from "@ant-design/icons";

const { Search } = Input;

export const SearchBar = (props: any) => (
  <Search {...props} className="search-bar" />
);

export const DownloadButton = (props: any) => (
  <DownloadOutlined {...props} className="download-button" />
);

export const FilterButton = (props: any) => (
  <FilterOutlined {...props} className="filter-button" />
);

export const SortButton = (props: any) => (
  <SortAscendingOutlined {...props} className="sort-button" />
);

export const SortDownButton = (props: any) => (
  <SortDescendingOutlined {...props} className="sort-button" />
);
