import { DataState } from "../_enums/data-state.enum";

/**
 * @author  Misty Mountain Apps LLC
 * @version 1.0
 * @since   7/24/2023
 */

export class AppState<T> {
    dataState:  DataState | undefined;
    appData?:   T | undefined;
    error?:     string | undefined;

}
