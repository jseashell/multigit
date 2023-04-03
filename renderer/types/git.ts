export interface GitTree {
  [key: string]: GitTreeNode;
}

export class GitTreeNode {
  hash: string;
  parents: GitTreeNode[];

  constructor(hash: string) {
    this.hash = hash;
    this.parents = [];
  }
}

export interface GitHistory {
  cwd: string;
  commits: GitCommit[];
}

export interface GitCommit {
  hash?: string;
  abbreviatedHash?: string;
  tree?: string;
  abbreviatedTree?: string;
  parent?: string;
  abbreviatedParent?: string;
  refs?: string;
  sanitizedSubject?: string;
  author?: {
    name?: string;
    email: string;
    date?: string;
  };
  commiter?: {
    name?: string;
    email?: string;
    date?: string;
  };
}
