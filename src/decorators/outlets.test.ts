import { Controller } from '@hotwired/stimulus';
import { Outlets } from './outlets';
import { Outlet } from './outlet';
import { startApplication } from '../../jest.utils';

describe('@Outlets', () => {
  it('should add `@Outlets` decorated properties to `static outlets` array of a controller', async () => {
    class TestController extends Controller {
      @Outlets firstOutlets!: HTMLElement[];
      @Outlets secondOutlets!: HTMLElement[];
    }

    const { test: testController } = await startApplication(
      { test: TestController },
      '<div data-controller="test"></div>',
    );

    expect((testController.constructor as typeof TestController).outlets).toStrictEqual(['first', 'second']);
  });

  it('should add `@Outlets` decorated properties to `static outlets` arrays of parent and child controllers separately', async () => {
    class ParentController extends Controller {
      @Outlets firstOutlets!: HTMLElement;
    }

    class ChildController extends ParentController {
      @Outlets secondOutlets!: HTMLElement;
    }

    const { parent: parentController, child: childController } = await startApplication(
      { parent: ParentController, child: ChildController },
      `
        <div data-controller="parent"></div>
        <div data-controller="child"></div>
      `,
    );

    expect((parentController.constructor as typeof ParentController).outlets).toStrictEqual(['first']);
    expect((childController.constructor as typeof ChildController).outlets).toStrictEqual(['second']);
  });

  it('should add `@Outlets` and `@Outlet` decorated properties to `static outlets` array of a controller without duplicating them', async () => {
    class TestController extends Controller {
      @Outlet firstOutlet!: HTMLElement;
      @Outlet secondOutlet!: HTMLElement;
      @Outlets secondOutlets!: HTMLElement[];
      @Outlets thirdOutlets!: HTMLElement[];
    }

    const { test: testController } = await startApplication(
      { test: TestController },
      '<div data-controller="test"></div>',
    );

    expect((testController.constructor as typeof TestController).outlets).toStrictEqual(['first', 'second', 'third']);
  });

  it("should throw an error when `@Outlets` decorated property doesn't end with `Outlets`", async () => {
    class TestController extends Controller {}

    const { test: testController } = await startApplication(
      { test: TestController },
      '<div data-controller="test"></div>',
    );

    expect(() => Outlets(testController, 'firstOutletsss')).toThrow('"firstOutletsss" must end with "Outlets"');
  });
});
