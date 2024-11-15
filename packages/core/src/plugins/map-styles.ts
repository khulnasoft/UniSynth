import { TraverseContext } from 'neotraverse/legacy';
import { getStyles, setStyles } from '../helpers/get-styles';
import { traverseNodes } from '../helpers/traverse-nodes';
import { UnisynthComponent } from '../types/unisynth-component';
import { UnisynthStyles } from '../types/unisynth-styles';

type MapStylesOptions = {
  map: (styles: UnisynthStyles, context: TraverseContext) => UnisynthStyles;
};

export const mapStyles = (pluginOptions: MapStylesOptions) => (options: any) => ({
  json: {
    pre: (json: UnisynthComponent) => {
      traverseNodes(json, (node, context) => {
        const styles = getStyles(node);
        setStyles(node, pluginOptions.map(styles || {}, context));
      });
    },
  },
});
