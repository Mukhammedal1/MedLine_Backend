import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CookieGetter = createParamDecorator(
  (data: string, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    return request.cookies?.[data] || null;
  }
);
