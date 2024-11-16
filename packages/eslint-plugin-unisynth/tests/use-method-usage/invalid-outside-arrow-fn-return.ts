import { ContextId, useContext } from '@khulnasoft.com/unisynth';
export const ID: ContextId<{ value: any }> = null!;

export const noUseSession = () => {
  return useContext(ID);
};

// Expect error: { "messageId": "useWrongFunction" }
