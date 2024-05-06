export interface HFModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum SkoleModelID {
  MIXTRAL_8_7B = 'mixtral-8-7b'
}
// export enum SkoleModelID {
//   LLAMA2_13B = 'llama2-13b'
// }

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
//export const fallbackModelID = SkoleModelID.LLAMA2_13B;
export const fallbackModelID = SkoleModelID.MIXTRAL_8_7B;

export const SkoleModels: Record<SkoleModelID, HFModel> = {
  [SkoleModelID.MIXTRAL_8_7B]: {
    id: SkoleModelID.MIXTRAL_8_7B,
    name: 'Mixtral-8 7b',
    maxLength: 12000,
    tokenLimit: 1024,
  }
};
