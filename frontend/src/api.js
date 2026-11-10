const API_URL = 'http://localhost:3000/api';

export async function getTasks(params= {}) {
    const queryParams = new URLSearchParams(params);

    const response = await fetch(`${API_URL}/tasks?${queryParams}`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch tasks');
    }

    return result.data;

}

export async function lalaTest() {
    const response = await fetch(`${API_URL}/tasks`);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch tasks');
    }

    return result.data;
}

export async function createTask(task) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || 'Failed to create task');
    }

    return result.data;
}

export function updateTask(id, task) {
    return fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update task');
        }

        return result.data;
    });
}

export function deleteTask(id) {
    return fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
    }).then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete task');
        }

        return result.data;
    });
}
