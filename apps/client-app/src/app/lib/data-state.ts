type ArgsType<T, E> = {
  data?: T;
  isLoading?: boolean;
  error?: E;
};

export class DataState<T, E> {
  data?: T = undefined;
  isLoading = false;
  error?: E = undefined;

  constructor(args?: ArgsType<T, E>) {
    this.data = args?.data;
    this.isLoading = args?.isLoading ?? false;
    this.error = args?.error;
  }

  get isDataLoaded(): boolean {
    if (this.isLoading) {
      return false;
    }
    return !!this.data;
  }

  get isError(): boolean {
    return !!this.error;
  }

  setData = (data?: T): void => {
    this.data = data;
  };

  setIsLoading = (value: boolean): void => {
    if (value) {
      this.error = undefined;
    }
    this.isLoading = value;
  };

  setError = (value?: E): void => {
    this.error = value;
  };
}
