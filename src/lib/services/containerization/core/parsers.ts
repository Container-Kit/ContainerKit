import type { Result } from '../types/result';
import type { Container, Image, ContainerId, ImageReference, Port } from '../types/common';

const isContainerJSON = (value: unknown): boolean =>
    typeof value === 'object' && value !== null && 'id' in value && 'status' in value;

const isImageJSON = (value: unknown): boolean =>
    typeof value === 'object' && value !== null && 'id' in value && 'size' in value;

const isPort = (value: unknown): value is Port =>
    typeof value === 'object' && value !== null && 'internal' in value;

export const parseContainer = (json: unknown): Result<Container> =>
    !isContainerJSON(json)
        ? { tag: 'failure', error: 'Invalid container JSON', stderr: '' }
        : {
              tag: 'success',
              value: {
                  id: (json as { id: string }).id as ContainerId,
                  name: (json as { name?: string }).name || '',
                  status: ((json as { status?: string }).status ||
                      'stopped') as Container['status'],
                  image: (json as { image?: string }).image as ImageReference,
                  created: new Date((json as { created?: string }).created || Date.now()),
                  ports: ((json as { ports?: unknown[] }).ports || []).filter(
                      isPort
                  ) as readonly Port[]
              }
          };

export const parseContainers = (json: unknown): Result<Container[]> =>
    !Array.isArray(json)
        ? { tag: 'failure', error: 'Expected array', stderr: '' }
        : {
              tag: 'success',
              value: json
                  .filter(isContainerJSON)
                  .map((item) => {
                      const result = parseContainer(item);
                      return result.tag === 'success' ? result.value : undefined;
                  })
                  .filter((c): c is Container => c !== undefined)
          };

export const parseImage = (json: unknown): Result<Image> =>
    !isImageJSON(json)
        ? { tag: 'failure', error: 'Invalid image JSON', stderr: '' }
        : {
              tag: 'success',
              value: {
                  id: (json as { id: string }).id || '',
                  reference: (json as { reference?: string }).reference as ImageReference,
                  created: new Date((json as { created?: string }).created || Date.now()),
                  size: (json as { size?: number }).size || 0
              }
          };

export const parseImages = (json: unknown): Result<Image[]> =>
    !Array.isArray(json)
        ? { tag: 'failure', error: 'Expected array', stderr: '' }
        : {
              tag: 'success',
              value: json
                  .filter(isImageJSON)
                  .map((item) => {
                      const result = parseImage(item);
                      return result.tag === 'success' ? result.value : undefined;
                  })
                  .filter((i): i is Image => i !== undefined)
          };
