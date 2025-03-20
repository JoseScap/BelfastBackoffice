export interface Stock {
  fromDate: string;
  toDate: string;
  stockQuantity: number;
  price: number;
  categoryId: string;
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
