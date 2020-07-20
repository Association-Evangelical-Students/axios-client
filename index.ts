import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { ILogger } from '@Association-Evangelical-Students/logger';

export interface IAxiosResponse<T> extends AxiosResponse<T> {}

export interface IAxiosRequestConfig extends AxiosRequestConfig {}

export interface IAxiosError extends AxiosError {}

export interface IAxiosClientConfig {
  baseURL: string;
  timeout: number;
  headers: { [key: string]: string };
  handlers?: {
    request?: {
      fulfilled?: (val: IAxiosRequestConfig) => IAxiosRequestConfig | Promise<IAxiosRequestConfig>,
      rejected?: (error: IAxiosError) => IAxiosError,
    },
    response?: {
      fulfilled?: <T>(response: IAxiosResponse<T>) => IAxiosResponse<T> | Promise<IAxiosResponse<T>>,
      rejected?: (error: IAxiosError) => IAxiosError,
    },
  },
}

export interface IAxiosClient {
  get<T>(path: string, requestConfig: IAxiosRequestConfig): Promise<IAxiosResponse<T>>;
  post<T, U>(path: string, body: U, requestConfig?: IAxiosRequestConfig): Promise<IAxiosResponse<T>>;
}

export class AxiosClient {
  private readonly instance: AxiosInstance;
  constructor(private logger: ILogger, axiosClientConfig: IAxiosClientConfig) {
    this.instance = axios.create({
      baseURL: axiosClientConfig.baseURL,
      timeout: axiosClientConfig.timeout,
      headers: axiosClientConfig.headers,
    });

    this.instance.interceptors.request.use(
      axiosClientConfig.handlers?.request?.fulfilled ?? this.requestFulfilledHandler.bind(this),
      axiosClientConfig.handlers?.request?.rejected ?? this.requestRejectedHandler.bind(this),
    );

    this.instance.interceptors.response.use(
      axiosClientConfig.handlers?.response?.fulfilled ?? this.responseFulfilledHandler.bind(this),
      axiosClientConfig.handlers?.response?.rejected ?? this.responseRejectedHandler.bind(this),
    )
  }

  public get<T>(path: string, requestConfig: IAxiosRequestConfig): Promise<IAxiosResponse<T>> {
    return this.instance.get(path, requestConfig);
  }

  public post<T, U>(path: string, body: U, requestConfig?: IAxiosRequestConfig): Promise<IAxiosResponse<T>> {
    return this.instance.post(path, body, requestConfig);
  }

  private requestFulfilledHandler(val: IAxiosRequestConfig): IAxiosRequestConfig | Promise<IAxiosRequestConfig> {
    return val;
  }

  private requestRejectedHandler(error: IAxiosError): IAxiosError {
    return error;
  }

  private responseFulfilledHandler<T>(response: IAxiosResponse<T>): IAxiosResponse<T> | Promise<IAxiosResponse<T>> {
    return response;
  }

  private responseRejectedHandler(error: IAxiosError): IAxiosError {
    return error;
  }
}
