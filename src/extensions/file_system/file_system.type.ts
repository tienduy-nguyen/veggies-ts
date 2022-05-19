import { Stats } from 'fs-extra'
import { FalsyString } from '../../core/core_types'

export interface FileSystem {
    getFileContent(cwd: FalsyString, file: string, encoding?: BufferEncoding): Promise<string>
    getFileInfo(cwd: FalsyString, file: string): Promise<Stats | null>
    createDirectory(cwd: FalsyString, directory: string): Promise<void>
    remove(cwd: FalsyString, fileOrDirectory: string): Promise<void>
}
