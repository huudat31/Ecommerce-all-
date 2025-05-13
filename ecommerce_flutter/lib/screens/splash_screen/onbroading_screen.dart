import 'package:ecommer_all/colors/color_app.dart';
import 'package:flutter/material.dart';

class OnbroadingScreen extends StatefulWidget {
  const OnbroadingScreen({super.key});

  @override
  State<OnbroadingScreen> createState() => _OnbroadingScreenState();
}

class _OnbroadingScreenState extends State<OnbroadingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<String> _images = [
    'assets/images/splash_screen_2.png',
    'assets/images/splash_screen_3.png',
    'assets/images/splash_screen_4.png',
  ];  

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Widget buildDot(int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4.0),
      width: _currentPage == index ? 12 : 8,
      height: _currentPage == index ? 12 : 8,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: _currentPage == index ? Colors.teal : Colors.grey,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: Colors.grey[900],
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Column(
                children: [
                  Expanded(
                    child: PageView.builder(
                      controller: _pageController,
                      onPageChanged: (int page) {
                        setState(() {
                          _currentPage = page;
                        });
                      },
                      itemCount: _images.length,
                      itemBuilder: (context, index) {
                        return Container(
                          decoration: BoxDecoration(
                            color: ColorApp.splash_screen_color,
                          ),
                          child: Center(
                            child: Image.asset(
                              _images[index],
                              width: screenWidth * 0.75,
                              height: screenHeight * 0.45,
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  // Bottom content
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(
                      color: ColorApp.splash_screen_color,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(10),
                        bottomRight: Radius.circular(10),
                      ),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Diary journal',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Poppins',
                          ),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Write down your memorable stories, express thoughts & feelings',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.black87,
                            fontSize: 15,
                            fontFamily: 'Poppins',
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Indicator + Button
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: List.generate(
                                _images.length,
                                (i) => buildDot(i),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                if (_currentPage == _images.length - 1) {
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const Scaffold(),
                                    ),
                                  );
                                } else {
                                  _pageController.nextPage(
                                    duration: const Duration(milliseconds: 400),
                                    curve: Curves.easeInOut,
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.teal,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 30,
                                  vertical: 12,
                                ),
                              ),
                              child: Text(
                                _currentPage == _images.length - 1
                                    ? 'Get Started'
                                    : 'Next',
                                style: const TextStyle(color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
