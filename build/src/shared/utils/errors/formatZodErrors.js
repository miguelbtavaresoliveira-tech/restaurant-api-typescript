import { z } from 'zod';
export function formatError(result) {
    return z.treeifyError(result.error);
}
