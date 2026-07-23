import { ValidationPipe } from '@nestjs/common';
import { CreateFeedbackSubmissionDto } from './create-feedback-submission.dto';

describe('CreateFeedbackSubmissionDto validation', () => {
  it('accepts the additional notes field from the public feedback form', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const payload = {
      day: '1',
      name: 'Test User',
      additionalNotes: 'Great session',
      ratingContent: '5',
      usefulness: 'Very Useful',
    };

    const result = await pipe.transform(payload, {
      type: 'body',
      metatype: CreateFeedbackSubmissionDto,
    });

    expect(result).toMatchObject({
      day: '1',
      name: 'Test User',
      additionalNotes: 'Great session',
      ratingContent: '5',
      usefulness: 'Very Useful',
    });
  });
});
