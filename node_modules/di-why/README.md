# Di Why

Dependency injection do it yourself style, but why?

Don't ever bother about dependencies anymore. Which file should I import first? Leave these kind of questions to this very simple yet powerful Dependency Injection solution.

The idea is very simple:

> We import all dependencies in a central location (it could be imported using fs, but we do it manually here). Once all these dependencies are added to a `loadDict`, anytime one dependant needs to load some dependency, it will ask for the dependency injection container (`DiContainer`) to get it. This way we avoid cyclical dependency issues etc.

How does the `DiContainer` know which dependencies to fetch you may ask? Because you specify the dependencies in a injection dictionary. Each entry in the dictionary will be stored with _handle_ (the dictionary's keys) by which dependants are to refer to the dependencies.

Here is an example injection dictionary element `LoadDictElement` (a single entry in the dictionary) let's store this in `./loaders/blogPostsDir.ts`:

```ts
import { LoadDictElement } from 'di-why/build/src/DiContainer';

type FactoryProps = {
  userOrDefaultDir: UserOrDefaultDirFunction;
};

const loadDictElement: LoadDictElement<Promise<string>> = {
  factory: async function ({ userOrDefaultDir }: FactoryProps) {
    return await userOrDefaultDir('MTB_MD_BLOG_POSTS_DIR', 'content');
  },
  locateDeps: {
    userOrDefaultDir: 'userOrDefaultDir',
  },
};
export default loadDictElement;
```

Let's see what happens above:

1. we import the Typescript type for the LoadDictElement, which guides us on the allowed keys
2. we create an object with a `factory` and `locateDeps` entries:
   - `factory` should be a callable, that will receive `locateDeps` object as input but instead of the values being the dependencies handles, they will be replaced by the actual dependency. This way dependencies can be used within the `factory` function to pass it to which ever new dependant we are creating. 
   - `locateDeps` are a list of `key: 'dependency_handle'` pairs that the `DiContainer` will have to resolve and find the actual dependencies. Once the di container has resolved those dependencies with their actual value, it will pass an object of dependencies to the dependant (by keeping the key names of the `locateDeps` object).
3. we export the `loadDictElement` to later add it to the `DiContainer` load dictionary (by importing it).

**Note**: how the `factory` can return a Promise.
**Note**: how the `factory` uses the same keys in the props object as the `locateDeps` object keys.

See how it depends on `userOrDefaultDir` in order to operate? We could have `import userOrDefaultDir from './userOrDefaultDir'` but since it is a dependency of many dependants, we decide to import it once and for all in a separate `loadDictElement` and then let `DiContainer` find it for us, anytime we want to use it. So here is `./loaders/userOrDefaultDir.ts`:

```ts
import 'dotenv/config';
import { LoadDictElement } from 'di-why/build/src/DiContainer';
import promiseFs from '../utils/promiseFs';

type FactoryProps = {
  MTB_USER_PROJECT_ROOT_DIR: string;
  MTB_ENV: string;
  MTB_ROOT_DIR: string;
  logger: { log: (...args: any[]) => any; };
};

const loadDictElement: LoadDictElement<UserOrDefaultDirFunction> = {
  factory: function ({ MTB_USER_PROJECT_ROOT_DIR, MTB_ENV, MTB_ROOT_DIR, logger }: FactoryProps) {
    return async function (envVarName: DirEnvVarNames, dirname: ContentDirNames) {
      const userXDir = process.env[envVarName]
        || `${MTB_USER_PROJECT_ROOT_DIR}/${dirname}`;

      const existsUserDir = await promiseFs.existsDir(userXDir);
      if (!existsUserDir) {
        if (MTB_ENV === 'clone') {
          throw new Error(`You must create a ./${dirname} dir at the root of your project after cloning repo`);
        }
        logger.log(`Using module's own ${dirname} dir`);
        const moduleStaticDir = `${MTB_ROOT_DIR}/${dirname}`;
        return moduleStaticDir;
      }
      return userXDir;
    };
  },
  locateDeps: {
    MTB_ENV: 'MTB_ENV',
    MTB_USER_PROJECT_ROOT_DIR: 'MTB_USER_PROJECT_ROOT_DIR',
    MTB_ROOT_DIR: 'MTB_ROOT_DIR',
    logger: 'logger',
  },
};
export default loadDictElement;
```

This time (above) we are still using a factory, with many dependencies. And `DiContainer` will locate those for us and inject them in the `factory` function for us. What is important to note here is that we export a `loadDictElement` again.

## Adding entries to the load dictionary

Now comes the important question: how do we pass all these `loadDictElement`s to the `DiContainer`? Through a central file where we import all these loaders. We can for example place it in `./loaders/index.ts`:

Let's create an example `DiContainer` by passing in a set of `LoadDictElements` with their respective handles.

```ts
import 'dotenv/config';

import DiContainer from 'di-why';

import MTB_ENV from './MTB_ENV';
import MTB_MD_BLOG_POSTS_DIR from './MTB_MD_BLOG_POSTS_DIR';
import MTB_ROOT_DIR from './MTB_ROOT_DIR';
import MTB_USER_PROJECT_ROOT_DIR from './MTB_USER_PROJECT_ROOT_DIR';
import loggerDict, { logger } from './logger';
import userOrDefaultDir from './userOrDefaultDir';

const injectionDict = {
  MTB_ENV,
  MTB_MD_BLOG_POSTS_DIR,
  MTB_ROOT_DIR,
  MTB_USER_PROJECT_ROOT_DIR,
  loggerDict,
  userOrDefaultDir,
};

const di = new DiContainer({ logger, load: injectionDict });

export default di;
```

The important parts here are:

1. Importing the `DiContainer`
2. Importing all `loadDictElements` and give them the name of the handle we have used to reference them in the `locateDeps` object.
3. Create the `injectionDict` using the handles as keys and whose values are the `LoadDictElements`
4. Create the `DiContainer` object and specify what it should `load` by passing in the `injectionDict`.
5. Note a `logger` is needed as constructor param. This will let you control how much the `DiContainer` should blab. The logger has to have two methods: `log` and `debug`.

That's basically it!

See the DiContainer `loadAll` method to see which entries you can add to `loadDictElement`: `constructible`, `instance`, `factory`, `before`, `after`, `injectable`.

You can also access the `serviceLocator` within those.