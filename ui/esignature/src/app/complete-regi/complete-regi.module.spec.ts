import { CompleteRegiModule } from './complete-regi.module';

describe('SignupModule', () => {
  let completeRegiModule: CompleteRegiModule;

  beforeEach(() => {
    completeRegiModule = new CompleteRegiModule();
  });

  it('should create an instance', () => {
    expect(completeRegiModule).toBeTruthy();
  });
});
