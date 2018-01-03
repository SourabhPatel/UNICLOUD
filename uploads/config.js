System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //typescript compiler options
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  //map tells the System loader where to look for things
  map: {
    
    'app': './src',
    
    '@angular/core': 'npm:@angular/core@2.1.1/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common@2.1.1/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler@2.1.1/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser@2.1.1/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@2.1.1/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http@2.1.1/bundles/http.umd.js',
    '@angular/router': 'npm:@angula/router@3.1.1/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms@2.1.1/bundles/forms.umd.js',
    
    '@angular/core/testing': 'npm:@angular/core@2.1.1/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common@2.1.1/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler@2.1.1/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser@2.1.1/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic@2.1.1/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http@2.1.1/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router@3.1.1/bundles/router-testing.umd.js',
    
    '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap@1.0.0-alpha.13/bundles/ng-bootstrap.js',
    
    'ng-formly': 'npm:ng-formly/bundles/ng-formly.umd.min.js',
    'rxjs': 'npm:rxjs@5.0.0-beta.12',
    'typescript': 'npm:typescript@2.0.3/lib/typescript.js'
  },
  //packages defines our app package
  packages: {
    app: {
      main: './main.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  }
});