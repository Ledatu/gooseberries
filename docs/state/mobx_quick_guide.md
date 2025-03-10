Основным state-manager'ом используется Mobx - https://mobx.js.org/README.html

Небольшой пример, как это все работает

```
import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;    // В полях класса описывается стейт, который будет использоваться

  constructor() {
    makeAutoObservable(this); // Экземпляр класса становится наблюдаемым, 
    // Что позволяет автоматически подгружать изменения в компонентах
  }

  increment() {         // Методы для изменения состояния. Можно и просто поля класса менять, 
                        // но это делать очень плохо, нужно для каждый изменений писать метод
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  reset() {
    this.count = 0;
  }
}

export const counterStore = new CounterStore();
```


Использование 

```
import { observer } from 'mobx-react-lite';
import counterStore from './CounterStore';


// функция observer позволяет автоматически наблюдать за изменениями в объекте-сторе 
export const Counter = observer(() => { 
  return (
    <div>
      <p>Count: {counterStore.count}</p>      // После нажатия на кнопки ниже ui тут обновится
      <button onClick={() => counterStore.increment()}>Increment</button>
      <button onClick={() => counterStore.decrement()}>Decrement</button>
      <button onClick={() => counterStore.reset()}>Reset</button>
    </div>
  );
});
```
