export interface Stock {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  stockQuantity: number;
  price: number;
  categoryId: string;
  categoryName?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface StocksByDateResponse {
  date: Date;
  count: number;
  price: number;
  categoryId: string;
  categoryName: string;
}

export interface GetStocksByFiltersResponse {
  individualStocks: StocksByDateResponse[];
}

export interface BulkCreateIndividualStocksResponse {
  createdStocks: number;
}

export interface BulkCreateIndividualStocksInput {
  packageName?: string;
  isBundle?: boolean;
  price: number;
  categoryId: string;
  stockQuantity: number;
  fromDate: string;
  toDate: string;
}

export interface GetStocksByFiltersInput {
  categoryId?: string;
  fromDate: string;
  toDate: string;
}

export interface UpdateStocksPriceInput {
  fromDate: string; // YYYY-MM-DD
  toDate: string; // YYYY-MM-DD
  categoryId: string;
  price: number;
}

export interface DeleteStocksInput {
  fromDate: string;
  toDate: string;
  categoryId: string;
  quantity: number;
}

export interface UpdateStocksPriceResponse {
  updatedStocks: number;
}

export interface DeleteStocksResponse {
  deletedStocks: number;
}
