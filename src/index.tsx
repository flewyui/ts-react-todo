import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface Todo {
    value: string;
    id: number;
    checked: boolean;
    removed: boolean;
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

const App: React.VFC = () => {
    const [text, setText] = useState('')
    const [todos, setTodos] = useState<Todo[]>([])
    const [filter, setFilter] = useState<Filter>('all')
    const translatedFilter = (arg: Filter) => {
        switch (arg) {
            case 'all':
                return '全てのタスク';
            case 'checked':
                return '完了済みのタスク';
            case 'unchecked':
                return '現在のタスク';
            case 'removed':
                return 'ごみ箱';
            default:
                return 'TODO';
        }
    }
    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case 'all':
                return !todo.removed;
            case 'checked':
                return todo.checked && !todo.removed;
            case 'unchecked':
                return !todo.checked && !todo.removed;
            case 'removed':
                return todo.removed;
            default:
                return todo;
        }
    })
    const handleOnEdit = (id: number, value: string) => {
        const newTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.value = value
            }
            return todo
        })
        setTodos(newTodos)
    }
    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement | HTMLInputElement>) => {
        e.preventDefault()
        if (!text) return
        const newTodo: Todo = {
            value: text,
            id: new Date().getTime(),
            checked: false,
            removed: false,
        }
        // スプレッド構文を用いて todos ステートのコピーへ newTodo を追加する
        // 以下と同義
        // const oldTodos = todos.slice()
        // setTodos(oldTodos.splice(0, 0, newTodo))
        setTodos([newTodo, ...todos])
        setText('')
    }
    const handleOnCheck = (id: number, checked: boolean) => {
        const newTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.checked = !checked
            }
            return todo
        })
        setTodos(newTodos)
    }
    const handleOnDelete = (id: number, removed: boolean) => {
        const newTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.removed = !removed;
            }
            return todo
        })
        setTodos(newTodos)
    }
    const handleOnEmpty = () => {
        const newTodos = todos.filter(todo => {
            return !todo.removed
        })
        setTodos(newTodos)
    }
    useEffect(() => {
        document.title = `TODO: ${translatedFilter(filter)}`
    }, [filter])

    return (
        <div>
            <div>
                <select
                    defaultValue="all"
                    onChange={(e) => setFilter(e.target.value as Filter)}>
                    <option value="all">{translatedFilter('all')}</option>
                    <option value="checked">{translatedFilter('checked')}</option>
                    <option value="unchecked">{translatedFilter('unchecked')}</option>
                    <option value="removed">{translatedFilter('removed')}</option>
                </select>
            </div>
            {filter === 'removed' ? (
                <div>
                    <button disabled={todos.filter(todo => todo.removed).length === 0} onClick={() => handleOnEmpty()}>ゴミ箱を空にする</button>
                </div>
            ) : (
                <form onSubmit={(e) => handleOnSubmit(e)}>
                    <input
                        type="text"
                        disabled={filter === 'checked'}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <input
                        type="submit"
                        disabled={filter === 'checked'}
                        value="追加"
                        onSubmit={(e) => handleOnSubmit(e)}
                    />
                </form>
            )}
            <div>
                <ul>
                    {filteredTodos.map(todo => {
                        return (
                            <li key={todo.id}>
                                <input
                                    type="checkbox"
                                    disabled={todo.removed}
                                    checked={todo.checked}
                                    onChange={() => handleOnCheck(todo.id, todo.checked)}
                                />
                                <input
                                    type="text"
                                    disabled={todo.checked || todo.removed}
                                    value={todo.value}
                                    onChange={(e) => handleOnEdit(todo.id, e.target.value)}
                                />
                                <button onClick={() => handleOnDelete(todo.id, todo.removed)}>
                                    {todo.removed ? '復元' : '削除'}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div >
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
