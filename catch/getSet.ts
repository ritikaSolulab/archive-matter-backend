import { getJson, setJson } from './query';

async function save(data: any) {
    return setJson(
        data._id,
        { ...data }
    );
}

async function fetchById(key: string) {
    return getJson(key);
}

export default {
    save,
    fetchById,
};
