import {inject} from 'aurelia-framework';
import {FetchConfig} from 'aurelia-auth';
import {AuthorizeStep} from 'aurelia-auth';

@inject(FetchConfig)
export class App {

  constructor(fetchConfig){
    this.fetchConfig = fetchConfig;
  }

  activate(){
      this.fetchConfig.configure();
  }

  configureRouter(config, router) {
    this.router = router;
    config.addPipelineStep('authorize', AuthorizeStep);
    config.title = 'ToDo';
    config.map([
      { route: ['', 'home'], moduleId: './modules/home', name: 'Home' },
      { route: 'list', moduleId: './modules/list', name: 'List', auth: true },
      { route: 'form', moduleId: './modules/form', name: 'Form', auth: true }
    ]);
  }
}