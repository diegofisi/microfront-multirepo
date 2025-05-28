import { Subject } from "rxjs";
export const bus: Subject<{ topic: string; payload?: any }>;
