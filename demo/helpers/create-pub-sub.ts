type Callback<DATA> = (data: DATA) => void;

type RemoveSubscriber = () => void;

type Subscribe<DATA> = (callback: Callback<DATA>) => RemoveSubscriber;

type Publish<DATA> = (data: DATA) => void;

export const createPubSub = <DATA>(): [Publish<DATA>, Subscribe<DATA>] => {
  const callbacks: Set<Callback<DATA>> = new Set();

  return [
    (arg) => {
      callbacks.forEach((callback) => {
        callback(arg);
      });
    },
    (callback: Callback<DATA>) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
  ];
};
