import { AnimatedIcon, type AnimatedIconProps } from './AnimatedIcon';
import { Icon, type IconProps } from './Icon';
import type { IconName } from './iconRegistry';

export type SemanticIconName = IconName;

interface SemanticIconProps extends Omit<AnimatedIconProps, 'name'> {
  name: SemanticIconName;
  animated?: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export function SemanticIcon({ name, animated = true, ...rest }: SemanticIconProps) {
  if (!animated) {
    const iconProps: IconProps = {
      ...(rest as Omit<IconProps, 'name'>),
      name,
    };
    return <Icon {...iconProps} />;
  }

  return <AnimatedIcon {...rest} name={name} />;
}
