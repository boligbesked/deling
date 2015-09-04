import path from 'path';


import { assign, exists } from './utils';

function getPackageJson(dir) {
  var pkg = path.join(dir, 'package.json')
  return exists(pkg) ? require(pkg) : false
}

function getRoot () {
  let pkgJson = false;

  if (!!~__dirname.indexOf('node_modules')) {
    let dir = module.id;

    while (path.basename(dir) !== 'node_modules') {
      dir = path.dirname(dir);
    }
    return [ path.dirname(dir), pkgJson ];
  }

  let dir = module;

  while (dir.parent && !pkgJson) {
    dir = dir.parent;
    pkgJson = getPackageJson(path.dirname(dir.filename));
  }
  return [ path.dirname(dir.filename), pkgJson ];
}

function getBaseInfo () {
  const [ rootPath, pkgJson ] = getRoot();

  return [
    process.env.NODE_ENV || 'development',
    rootPath,
    pkgJson || getPackageJson(rootPath)
  ];
}

function deling () {
  const [ env, root, pkgJson ] = getBaseInfo();

  const config = {
//    pkgJson,
    root,
    env,
    name: pkgJson.name || '',
    version: pkgJson.version || ''
  };

  const files = [];

  // Located in config-directory
  if (exists(path.join(root, 'config'))) {
    files.push(
      path.join(root, 'config', 'default'),
      path.join(root, 'config', env),
      path.join(root, 'config', 'local')
    );
  }
  // Located in root
  else {
    files.push(
      path.join(root, 'config'),
      path.join(root, 'config.' + env),
      path.join(root, 'config.local')
    );
  }

  function readFile (file) {
    try {
      return require(file);
    }
    catch (err) {
      return {};
    }
  }

  files.map(readFile).reduce(assign, config);

  return config;
}

export default deling();
