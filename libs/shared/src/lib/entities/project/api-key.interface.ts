export interface IApiKey {
  /*
   * backward compatibility -
   * remove `string` type after encrypt-api-keys-migration run
   * remove the optional from hash
   */
  key: string;
  hash?: string;
  userId: string;
  projectId: string;
}