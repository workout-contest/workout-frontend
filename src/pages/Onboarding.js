import React, { useState } from 'react';
import styled from 'styled-components';
import storageManager from '../utils/storageManager';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 60%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  width: 100%;
  max-width: 1200px;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    max-width: 600px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  text-align: left;
  animation: slideInLeft 0.8s ease-out;

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 968px) {
    text-align: center;
    order: 2;
  }
`;

const RightSection = styled.div`
  animation: slideInRight 0.8s ease-out;

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 968px) {
    order: 1;
  }
`;

const ContentWrapper = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: var(--spacing-xl);
    border-radius: var(--radius-xl);
  }
`;

const Logo = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  color: white;
  box-shadow: var(--shadow-lg);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Title = styled.h1`
  font-family: var(--font-primary);
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: var(--spacing-md);
  letter-spacing: -0.025em;
  line-height: 1.2;

  @media (max-width: 968px) {
    font-size: 2.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: var(--spacing-xl);
  font-weight: 400;

  @media (max-width: 968px) {
    font-size: 1.1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-primary);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
`;

const FeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
`;

const FormTitle = styled.h2`
  font-family: var(--font-primary);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.025em;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--primary-gradient);
    border-radius: 2px;
  }
`;

const FormSubtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  font-weight: 400;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  &:nth-child(1),
  &:nth-child(2) {
    grid-column: span 1;
  }

  &:nth-child(3) {
    grid-column: span 2;

    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }

  &:nth-child(4),
  &:nth-child(5) {
    grid-column: span 1;
  }
`;

const Label = styled.label`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: var(--spacing-xs);
`;

const Input = styled.input`
  font-family: var(--font-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-primary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: var(--text-light);
    font-weight: 400;
  }

  &:hover {
    border-color: var(--border-medium);
  }
`;

const Select = styled.select`
  font-family: var(--font-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &:hover {
    border-color: var(--border-medium);
  }
`;

const Button = styled.button`
  font-family: var(--font-primary);
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ButtonIcon = styled.span`
  font-size: 1.1rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const TabContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  backdrop-filter: blur(10px);
`;

const TabButton = styled.button`
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: ${props =>
    props.active ? 'rgba(255, 255, 255, 0.9)' : 'transparent'};
  color: ${props => (props.active ? '#333333' : '#e0e0e0')};
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)'};
    color: ${props => (props.active ? '#333333' : '#333333')};
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(34, 197, 94, 0.2);
  text-align: center;
`;

const BMIDisplay = styled.div`
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  margin-top: var(--spacing-md);
  border: 1px solid var(--border-light);
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const BMIText = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
`;

const BMIValue = styled.div`
  font-family: var(--font-secondary);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`;

const BMICategory = styled.div`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-md);
  display: inline-block;
`;

const Onboarding = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('signup'); // 'login' 또는 'signup'
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    username: '',
    password: '',
  });

  const [bmi, setBmi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // BMI 자동 계산
    if (name === 'height' || name === 'weight') {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;

      if (height && weight) {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        const calculatedBMI = (
          weightInKg /
          (heightInMeters * heightInMeters)
        ).toFixed(1);
        setBmi(calculatedBMI);
      }
    }
  };

  const getBMICategory = bmiValue => {
    if (bmiValue < 18.5) return '저체중';
    if (bmiValue < 23) return '정상';
    if (bmiValue < 25) return '과체중';
    if (bmiValue < 30) return '경도비만';
    return '고도비만';
  };

  const handleSubmit = async e => {
    console.log('=== handleSubmit 함수 호출됨! ===');
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        // 회원가입
        const signupData = {
          name: formData.name,
          age: parseInt(formData.age, 10),
          gender: formData.gender,
          height: parseInt(formData.height, 10),
          weight: parseFloat(formData.weight),
          username: formData.username,
          password: formData.password,
        };

        const response = await apiService.signup(signupData);

        setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');

        // 로그인 탭으로 전환
        setActiveTab('login');

        // 폼 데이터 초기화 (아이디, 비밀번호만 남기고)
        setFormData(prev => ({
          username: prev.username,
          password: '',
          name: '',
          age: '',
          gender: '',
          height: '',
          weight: '',
        }));

        setIsLoading(false);
      } else {
        // 로그인
        const loginData = {
          username: formData.username,
          password: formData.password,
        };

        const response = await apiService.login(loginData);

        setSuccess('로그인에 성공했습니다!');

        // 즉시 홈 화면으로 이동
        onComplete();
      }
    } catch (error) {
      const errorMessage =
        error.message ||
        (activeTab === 'signup'
          ? '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'
          : '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const isFormValid =
    activeTab === 'login'
      ? formData.username && formData.password
      : formData.name &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight &&
        formData.username &&
        formData.password;

  return (
    <OnboardingContainer>
      <BackgroundPattern />
      <MainContent>
        <LeftSection>
          <Logo>
            <LogoIcon>💪</LogoIcon>
          </Logo>
          <Title>헬스케어 시작하기</Title>
          <Subtitle>
            개인 맞춤형 건강 관리와 동영상 추천 서비스를 통해 더 건강한 삶을
            시작해보세요
          </Subtitle>
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>🎥</FeatureIcon>
              <span>BMI 기반 맞춤 동영상 추천</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>📋</FeatureIcon>
              <span>개인화된 운동 계획 수립</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <span>실시간 진행 상황 추적</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🍎</FeatureIcon>
              <span>영양 가이드 및 식단 관리</span>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>👥</FeatureIcon>
              <span>커뮤니티 챌린지 참여</span>
            </FeatureItem>
          </FeatureList>
        </LeftSection>

        <RightSection>
          <ContentWrapper>
            <TabContainer>
              <TabButton
                active={activeTab === 'login'}
                onClick={() => setActiveTab('login')}
              >
                로그인
              </TabButton>
              <TabButton
                active={activeTab === 'signup'}
                onClick={() => setActiveTab('signup')}
              >
                회원가입
              </TabButton>
            </TabContainer>

            <FormHeader>
              <FormTitle>
                {activeTab === 'login' ? '로그인' : '개인 정보 입력'}
              </FormTitle>
              <FormSubtitle>
                {activeTab === 'login'
                  ? '아이디와 비밀번호를 입력해주세요'
                  : '정확한 정보를 입력하시면 더욱 정밀한 건강 분석과 맞춤형 서비스를 제공받을 수 있습니다'}
              </FormSubtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>아이디</Label>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label>비밀번호</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </InputGroup>

              {activeTab === 'signup' && (
                <>
                  <InputGroup>
                    <Label>이름</Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>나이</Label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="나이를 입력하세요"
                      min="1"
                      max="120"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>성별</Label>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">성별을 선택하세요</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </Select>
                  </InputGroup>

                  <InputGroup>
                    <Label>키 (cm)</Label>
                    <Input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="키를 입력하세요"
                      min="100"
                      max="250"
                      required
                    />
                  </InputGroup>

                  <InputGroup>
                    <Label>몸무게 (kg)</Label>
                    <Input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="몸무게를 입력하세요"
                      min="20"
                      max="200"
                      step="0.1"
                      required
                    />
                  </InputGroup>
                </>
              )}

              {/* 로그인 시 빈 공간 채우기 */}
              {activeTab === 'login' && (
                <>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              )}
            </Form>

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {bmi && activeTab === 'signup' && (
              <BMIDisplay>
                <BMIText>당신의 BMI</BMIText>
                <BMIValue>{bmi}</BMIValue>
                <BMICategory>{getBMICategory(bmi)}</BMICategory>
              </BMIDisplay>
            )}

            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              onClick={e => {
                console.log('버튼 클릭됨!');
                console.log('isFormValid:', isFormValid);
                console.log('isLoading:', isLoading);
                console.log('formData:', formData);

                if (isFormValid && !isLoading) {
                  console.log('handleSubmit 직접 호출!');
                  handleSubmit(e);
                }
              }}
            >
              {isLoading ? <LoadingSpinner /> : <ButtonIcon>🚀</ButtonIcon>}
              <span>
                {isLoading
                  ? '처리 중...'
                  : activeTab === 'login'
                    ? '로그인하기'
                    : '헬스케어 서비스 시작하기'}
              </span>
            </Button>
          </ContentWrapper>
        </RightSection>
      </MainContent>
    </OnboardingContainer>
  );
};

export default Onboarding;
