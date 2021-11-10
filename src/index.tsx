import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import './style.css';

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
    const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as Filter);
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
    const handleOnEdit = (id: number, value: string) => {
        const newTodos = todos.map(todo => {
            if (todo.id === id) {
                todo.value = value
            }
            return todo
        })
        setTodos(newTodos)
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
    const reset = () => {
        setText('')
        setTodos([])
        setFilter('all')
    }
    useEffect(() => {
        document.title = `TODO: ${translatedFilter(filter)}`
    }, [filter])

    return (
        <div className='wrapper'>
            <div className='header'>
                <h2 onClick={() => reset()}>
                    Todo
                </h2>
            </div>
            <div className='filter_input'>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Todo"
                        value={filter}
                        onChange={handleChange}
                    >
                        <MenuItem value="all">{translatedFilter('all')}</MenuItem>
                        <MenuItem value="checked">{translatedFilter('checked')}</MenuItem>
                        <MenuItem value="unchecked">{translatedFilter('unchecked')}</MenuItem>
                        <MenuItem value="removed">{translatedFilter('removed')}</MenuItem>
                    </Select>
                </FormControl>
                <div className='task_form'>
                    <form onSubmit={(e) => handleOnSubmit(e)}>
                        <TextField
                            variant="standard"
                            label="タスクを追加する"
                            disabled={filter === 'checked'}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="small"
                            disabled={filter === 'checked'}
                            style={{ verticalAlign: 'bottom' }}
                        >
                            追加
                        </Button>
                    </form>
                </div>
            </div>
            {filter === 'removed' && (
                <div className='garbage'>
                    <Button
                        variant="contained"
                        disabled={todos.filter(todo => todo.removed).length === 0}
                        size="small"
                        onClick={() => handleOnEmpty()}
                    >
                        ゴミ箱を空にする
                    </Button>
                </div>
            )}
            <ul className="todos_list">
                <h4>{filter === 'removed' ? '削除済みタスク一覧' : 'タスク一覧'}：</h4>
                {filteredTodos.map(todo => {
                    return (
                        <li key={todo.id}>
                            <Checkbox
                                disabled={todo.removed}
                                checked={todo.checked}
                                onChange={() => handleOnCheck(todo.id, todo.checked)} />
                            <TextField
                                variant="outlined"
                                disabled={todo.checked || todo.removed}
                                value={todo.value}
                                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
                                size="small"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                onClick={() => handleOnDelete(todo.id, todo.removed)}
                            >
                                {todo.removed ? '復元' : '削除'}
                            </Button>
                        </li>
                    )
                })}
            </ul>
        </div >
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
