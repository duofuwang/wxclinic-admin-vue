const UserKey = 'user'

var storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key));
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    getUser() {
        return JSON.parse(localStorage.getItem(UserKey));
    },
    setUser(user) {
        localStorage.setItem(UserKey, JSON.stringify(user));
    },
    removeUser() {
        localStorage.removeItem(UserKey);
    }
}

export default storage;